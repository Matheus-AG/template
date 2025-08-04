import pandas as pd
from string import Template
import json
import sys
import os

sys.stdout.reconfigure(encoding="utf-8")
df = pd.read_csv(sys.argv[1])
os.chdir('scripts')
df  = df[0:-3]
df['CNES'] = df['CNES'].astype(int)
df['Cód. Procedimento'] = df['Cód. Procedimento'].astype(int)
df['Idade'] = df['Idade'].astype(int)
df['Frequência'] = df['Frequência'].astype(int)

parto = df.loc[df['Agrupamento'] == 'Parto']
parto = parto.loc[(parto['Idade'] < 9) | (parto['Idade'] > 60)]

laqueadura = df.loc[df['Agrupamento'] == 'Laqueadura']
laqueadura = laqueadura.loc[(laqueadura['Idade'] < 21) | (laqueadura['Idade'] > 60)]

df = pd.concat([parto,laqueadura])

def nome_municipio(municipio):
    preposicao = ['da', 'de', 'do', 'das', 'dos']
    return ' '.join([palavra.lower() if palavra.lower() in preposicao else palavra.capitalize()
                     for palavra in municipio.split()])

def configurar_cep(cep):
    cep = ''.join(char for char in cep if char.isdigit())
    cep = cep[:4] + '-' + cep[4:]
    return cep

def capital_por_uf(uf):
    with open('capitais.json', 'r', encoding='utf-8') as file:
        capitais = json.load(file)
        uf = uf.upper()
        return capitais[uf]['cidade']

def gerar_oficio(ano, competencia,nome, sexo, ambito, endereco, cep, municipio, uf, processo, procedimentos,nome_diretor,genero_diretor):
    #gera as informações necessárias para o oficio
    genero = 'a' if sexo == 'M' else 'o'
    tratamento = 'Senhora' if sexo == 'M' else 'Senhor'
    preposicao = 'À' if sexo == 'M' else 'Ao'
    ambito_adjetivo = 'Municipal' if ambito == 'M' else 'Estadual'
    ambito_subjetivo = 'Município' if ambito == 'M' else 'Estado'
    municipio = nome_municipio(municipio)
    freq_total = sum(procedimento[4] for procedimento in procedimentos)
    plural = 's' if freq_total > 1 else ''
    plural_c = 'ões' if freq_total > 1 else 'ão'
    plural_foi = 'foram' if freq_total > 1 else 'foi'
    plural_agrupamento = 's' if len(set(procedimento[0] for procedimento in procedimentos)) > 1 else ''
    agrupamento = ' e '.join(set(procedimento[0] for procedimento in procedimentos)).lower()
    genero_diretor = 'a' if genero_diretor == 'M' else ''
    with open('capitais.json', 'r', encoding='utf-8') as file:
        capitais = json.load(file)
        local = f'de {municipio}/{uf}' if ambito == 'M' else f'{capitais[uf]['preposicao_do']} {capitais[uf]['estado']}'
        localidade = f'no município de {municipio}/{uf}' if ambito == 'M' else f'{capitais[uf]['preposicao']} {capitais[uf]['estado']}'
    #Adiciona as informações necessárias à primeira parte do oficio
    with open('template_inicio.txt','r',encoding='UTF-8') as file:
        procedimento = procedimentos[0][1]
        codigo = procedimentos[0][2]
        idade = procedimentos[0][3]
        template = Template(file.read())
        inicio = template.substitute(nome=nome,
                                genero=genero,
                                ambito_adjetivo=ambito_adjetivo,
                                tratamento=tratamento,
                                endereco=endereco,
                                processo=processo,
                                preposicao=preposicao,
                                municipio=municipio,
                                cep=cep,
                                uf=uf,
                                ano=ano,
                                local=local
                                )
    if len(procedimentos) < 2:
        with open('template_meio_simples.txt','r',encoding='UTF-8') as file:
            template = Template(file.read())
            meio = template.substitute(ambito_subjetivo=ambito_subjetivo,
                                    plural=plural,
                                    plural_c=plural_c,
                                    plural_foi=plural_foi,
                                    freq_total=freq_total,
                                    agrupamento=agrupamento,
                                    plural_agrupamento=plural_agrupamento,
                                    procedimento=procedimento,
                                    codigo=codigo,
                                    idade=idade,
                                    localidade=localidade,
                                    ano=ano,
                                    competencia=competencia
                                    )
    else:
        with open('template_meio_tabela.txt','r',encoding='UTF-8') as file:
            proced = ''
            for procedimento in procedimentos:
                proced += f'Agrupamento: {procedimento[0]}; Procedimento {procedimento[1]}; Código: {procedimento[2]}; Idade: {procedimento[3]}; Frequência: {procedimento[4]};\n'
            template = Template(file.read())
            meio = template.substitute(ambito_subjetivo=ambito_subjetivo,
                                    plural=plural,
                                    plural_c=plural_c,
                                    plural_foi=plural_foi,
                                    freq_total=freq_total,
                                    agrupamento=agrupamento,
                                    plural_agrupamento=plural_agrupamento,
                                    localidade=localidade,
                                    procedimentos=proced,
                                    ano=ano,
                                    competencia=competencia
                                    )
    with open('template_fim.txt','r',encoding='UTF-8') as file:
        template = Template(file.read())
        fim = template.substitute(processo=processo,
                                     nome_diretor=nome_diretor,
                                     genero_diretor=genero_diretor
                                     )

    with open(f'textos/{municipio}-{uf}.txt' if ambito == 'M' else f'textos/{uf}.txt','w',encoding='UTF-8') as output:
        output.write(f'{inicio}\n{meio}\n{fim}')

output = []

gestao_municipal = df.loc[df['Gestão'] == 'M']
gestao_municipal = gestao_municipal[['Gestão','CNES','Procedimento','Cód. Procedimento','Idade','UF','Município','Frequência','Agrupamento']]
for municipio in gestao_municipal['Município'].unique():
    tabela = gestao_municipal.loc[gestao_municipal['Município'] == municipio]
    uf = tabela['UF'].values[0]
    tabela = tabela.groupby(['Agrupamento','Procedimento','Cód. Procedimento','Idade'],as_index=False).agg({'Frequência':'sum'})
    output.append({'ambito':'M','municipio':municipio,'uf':uf, 'procedimentos':tabela.values.tolist()})
    #gerar_oficio('2025','4','Fulano','M','M','Rua 11', '12345678',municipio,uf,'25000.XXXXXX/2025-XX',tabela.values.tolist(),'CARLOS AMILCAR SALGADO','H')

gestao_estadual = df.loc[df['Gestão'] == 'E']
gestao_estadual = gestao_estadual[['Gestão','CNES','Procedimento','Cód. Procedimento','Idade','UF','Município','Frequência','Agrupamento']]
for estado in gestao_estadual['UF'].unique():
    tabela = gestao_estadual.loc[gestao_estadual['UF'] == estado]
    tabela = tabela.groupby(['Agrupamento','Procedimento','Cód. Procedimento','Idade'],as_index=False).agg({'Frequência':'sum'})
    output.append({'ambito':'E','municipio':capital_por_uf(estado),'uf':estado, 'procedimentos':tabela.values.tolist()})
   #gerar_oficio(2025,4,'Fulano','H','E','Rua 11', '12345678',capital_por_uf(estado),estado,'25000.XXXXXX/2025-XX',tabela.values.tolist(),'Matheus','H')
sys.stdout.write(json.dumps(output))