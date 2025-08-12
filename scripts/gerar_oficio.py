from string import Template
import json
import sys
import os

def nome_municipio(municipio):
    preposicao = ['da', 'de', 'do', 'das', 'dos']
    return ' '.join([palavra.lower() if palavra.lower() in preposicao else palavra.capitalize()
                     for palavra in municipio.split()])

def gerar_oficio(ano, competencia,nome, sexo, ambito, endereco, cep, municipio, uf, processo, procedimentos,nome_diretor,genero_diretor,id):

    #gera as informações necessárias para o oficio
    genero = 'a' if sexo == 'M' else 'o'
    tratamento = 'Senhora' if sexo == 'M' else 'Senhor'
    preposicao = 'À' if sexo == 'M' else 'Ao'
    ambito_adjetivo = 'Municipal' if ambito == 'M' else 'Estadual'
    ambito_subjetivo = 'Município' if ambito == 'M' else 'Estado'
    municipio = nome_municipio(municipio)
    freq_total = sum(procedimento['frequencia'] for procedimento in procedimentos)
    plural = 's' if freq_total > 1 else ''
    plural_c = 'ões' if freq_total > 1 else 'ão'
    plural_foi = 'foram' if freq_total > 1 else 'foi'
    plural_agrupamento = 's' if len(set(procedimento['agrupamento'] for procedimento in procedimentos)) > 1 else ''
    agrupamento = ' e '.join(set(procedimento['agrupamento'] for procedimento in procedimentos)).lower()
    genero_diretor = 'a' if genero_diretor == 'M' else ''
    with open('capitais.json', 'r', encoding='utf-8') as file:
        capitais = json.load(file)
        local = f'de {municipio}/{uf}' if ambito == 'M' else f'{capitais[uf]['preposicao_do']} {capitais[uf]['estado']}'
        localidade = f'no município de {municipio}/{uf}' if ambito == 'M' else f'{capitais[uf]['preposicao']} {capitais[uf]['estado']}'

    #Adiciona as informações necessárias à primeira parte do oficio
    with open('template_inicio.txt','r',encoding='UTF-8') as file:
        procedimento = procedimentos[0]['procedimento']
        codigo = procedimentos[0]['codigo']
        idade = procedimentos[0]['idade']
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
                proced += f'Agrupamento: {procedimento['agrupamento']}; Procedimento: {procedimento['procedimento']}; Código: {procedimento['codigo']}; Idade: {procedimento['idade']}; Frequência: {procedimento['frequencia']};\n'
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

    return f'{inicio}\n{meio}\n{fim}'

with open(sys.argv[1],'r',encoding='utf-8') as file:
    oficio = json.loads(file.read())

os.chdir('scripts')

texto = gerar_oficio(int(oficio['ano']),
                int(oficio['competencia']),
                oficio['nome_secretario'],
                oficio['sexo_secretario'],
                oficio['ambito'],
                oficio['endereco'],
                oficio['cep'],
                oficio['municipio'],
                oficio['uf'],
                oficio['processo'],
                oficio['procedimentos'],
                oficio['nome_diretor'],
                oficio['sexo_diretor'],
                oficio['id'])

os.chdir('..')

with open(sys.argv[1],'w',encoding='utf-8') as file:
    file.write(texto)

