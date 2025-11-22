# Sistema de hasteamento de bandeiras digitais

## :cog: Como funciona

### Primeiros passos

1. Selecionar os países nas suas respectivas colocações pelo menu lateral
2. Aplicar as bandeiras escolhidas ao modelo 3D
3. Escolher um cenário para a animação
4. Começar animação através do botão :play: no canto inferior direito, ou através do atalho da **tecla de espaço**

### Atalhos

- **Dígito 1** câmera dá zoom no primeiro colocado
- **Dígito 2** câmera movimenta-se para enquadrar o movimento de hasteamento da esquerda
- **Dígito 3** câmera movimenta-se para enquadrar o movimento de hasteamento da direita
- **Dígito 0** câmera volta a posição inicial
- **Ctrl + Dígito 1** Visualizar/esconder bandeira do primeiro lugar
- **Ctrl + Dígito 2** Visualizar/esconder bandeira do segundo lugar
- **Ctrl + Dígito 3** Visualizar/esconder bandeira do terceiro lugar
- **Ctrl + Dígito 4** Visualizar/esconder bandeira do quarto lugar
- **Tecla W** câmera dá zoom
- **Tecla S** câmera retira zoom
- **Seta para cima** câmera rotaciona para cima
- **Seta para baixo** câmera rotaciona para baixo
- **Seta para a direita ou tecla A** câmera rotaciona para a direita
- **Seta para a esquerda ou tecla D** câmera rotaciona para a esquerda
- **Movimento do mouse com botão esquerdo pressionado** movimento de câmera multirotacional
- **Tecla de espaço** *play/pause*
- **Tecla Ctrl + espaço** *Restart*
- **Tecla T** Tela cheia
- **Tecla Esc** Sair de tela cheia

> :exclamation-triangle: **Atenção** ao dar *play* no sistema ele automáticamente reinicia o hasteamento, portanto, não dar *play* durante o hasteameto

## :cog: Configurações

Para adicionar novos **cenários** ou novas **bandeiras** você precisa ter conhecimento da estrutura de tipos de arquivo *json*.

Localizando os arquivos `background.json` (arquivo de configuração de cenário) e `database.json` (arquivo de configuração de bandeiras) na pasta `js` você pode ter acesso e adicionar novos itens. Favor colocar as bandeiras sempre em ordem alfabética

Após isso é necessário adicionar a bandeira e o hino.> :exclamation-circle: **Importante** as extensões dos arquivos devem ser *.jpg e *.mp3 para bandeira e hinos respectivamente

Para adicionar nova bandeira você deve colocar sua imagem na pasta `img/bandeira`, para adicionar um novo cenário a imagem deve ficar na pasta `img/fundo`. Os inos devem ser ineridos em `sound/hinos`.

Após isso é necessário adicionar a bandeira e o hino.> :exclamation-circle: **Importante** os nomes da imagem da bandeira e áudio do hino devem ser iguais, respeitando o nome da propriedade apelido do novo país dicionado no documento json.

### Arquivos json

Um item de bandeira no arquivo `database.json` é composto por:

```
{
    "nome" : "Brasil",
    "apelido" : "brasil"
}
```

, sendo o apelido o mesmo nome dos arquivos de imagem e áudio referente ao país, mas sem sua extensão.

Um item de cenário no arquivo `background.json` é composto por:

```
{
    "nome" : "Ginásio - CEFAN",
    "apelido" : "cefan",
    "url" : "cefan.jpg"
}
```

, sendo o nome a palavra que aparecerá para o usuário reconhecer e a url o nome do arquivo de imagem com sua extensão na pasta `img/fundo`.

<video controls>
    <source src="readme/video.ogv" type="video/ogg">
    Your browser does not support HTML5 video.
</video>