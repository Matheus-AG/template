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


def configurar_cep(cep):
    cep = ''.join(char for char in cep if char.isdigit())
    cep = cep[:4] + '-' + cep[4:]
    return cep

def capital_por_uf(uf):
    with open('capitais.json', 'r', encoding='utf-8') as file:
        capitais = json.load(file)
        uf = uf.upper()
        return capitais[uf]['cidade']

output = []

gestao_municipal = df.loc[df['Gestão'] == 'M']
gestao_municipal = gestao_municipal[['Gestão','CNES','Procedimento','Cód. Procedimento','Idade','UF','Município','Frequência','Agrupamento']]
for municipio in gestao_municipal['Município'].unique():
    tabela = gestao_municipal.loc[gestao_municipal['Município'] == municipio]
    uf = tabela['UF'].values[0]
    tabela = tabela.groupby(['Agrupamento','Procedimento','Cód. Procedimento','Idade'],as_index=False).agg({'Frequência':'sum'})
    output.append({'ambito':'M','municipio':municipio,'uf':uf, 'procedimentos':tabela.values.tolist()})

gestao_estadual = df.loc[df['Gestão'] == 'E']
gestao_estadual = gestao_estadual[['Gestão','CNES','Procedimento','Cód. Procedimento','Idade','UF','Município','Frequência','Agrupamento']]
for estado in gestao_estadual['UF'].unique():
    tabela = gestao_estadual.loc[gestao_estadual['UF'] == estado]
    tabela = tabela.groupby(['Agrupamento','Procedimento','Cód. Procedimento','Idade'],as_index=False).agg({'Frequência':'sum'})
    output.append({'ambito':'E','municipio':capital_por_uf(estado),'uf':estado, 'procedimentos':tabela.values.tolist()})
    
sys.stdout.write(json.dumps(output))