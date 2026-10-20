# Auxílio-Saúde (OneDrive)

App web gratuito para controlar os gastos com o auxílio-saúde. Cada pessoa entra com a própria conta Microsoft, e os lançamentos e as fotos das notas ficam no OneDrive dela. Não existe servidor: o site é só um conjunto de arquivos estáticos, publicado de graça no GitHub Pages, que o usuário instala como atalho na tela inicial.

| Arquivo | Para que serve |
|---|---|
| `index.html` | O app inteiro (telas, login Microsoft, OneDrive, leitura por IA) |
| `config.js` | **Único arquivo que você precisa editar:** ID do app na Microsoft, código de acesso e contador de uso |
| `privacidade.html` | Política de Privacidade e Termos de Uso (a Microsoft pede esses links) |
| `manifest.webmanifest`, `sw.js`, ícones | Permitem instalar o atalho e abrir sem internet |

A publicação tem três partes, nesta ordem: **(1)** publicar no GitHub Pages para ganhar um endereço, **(2)** registrar esse endereço na Microsoft, **(3)** colar o ID do registro no `config.js`. As partes 4 e 5 tratam do controle de quem usa.

---

## Parte 1 — Publicar no GitHub Pages (gratuito)

1. Crie uma conta em **github.com**, se ainda não tiver.
2. Clique em **+ → New repository**.
   - **Repository name:** `auxilio-saude-onedrive` (pode ser outro; ele vira parte do endereço).
   - Marque **Public**. No plano gratuito, o GitHub Pages só funciona com repositório público. O código fica visível, mas os dados dos usuários não, porque ficam no OneDrive de cada um.
   - Clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file** (ou **Add file → Upload files**).
4. Arraste **todos os arquivos desta pasta** (não a pasta em si) e clique em **Commit changes**.
5. Vá em **Settings → Pages**.
   - Em **Source**, escolha **Deploy from a branch**.
   - Em **Branch**, escolha **main** e a pasta **/ (root)**. Clique em **Save**.
6. Espere de 1 a 3 minutos e recarregue a página. Vai aparecer o endereço do site:

   ```
   https://SEU-USUARIO.github.io/auxilio-saude-onedrive/
   ```

   Anote esse endereço **exatamente assim, com a barra no final**. Ele é usado na Parte 2.

Neste ponto o site já abre, mas o botão "Entrar com Microsoft" ainda avisa que o login não foi configurado. Isso é esperado.

---

## Parte 2 — Registrar o app na Microsoft (gratuito)

A Microsoft não permite mais registrar apps só com a conta pessoal: o registro precisa ficar dentro de um "diretório" (tenant). O jeito gratuito de ter um é criar uma conta Azure gratuita.

### 2.1 Criar o diretório (uma vez só)

1. Acesse **azure.microsoft.com/free** e entre com a sua conta Microsoft (Outlook/Hotmail).
2. Siga o cadastro da conta gratuita. A Microsoft pode pedir um cartão **só para verificar a identidade**. Registrar apps não gera cobrança. Ela também pode pedir um telefone.
3. Ao terminar, sua conta passa a ter um **Diretório padrão** no Microsoft Entra.

> Se você já tem acesso de administrador ou desenvolvedor a um diretório (por exemplo, de uma empresa sua), pode usá-lo e pular este passo. **Não use o diretório do órgão onde trabalha** sem autorização da TI.

### 2.2 Criar o registro do app

1. Acesse **entra.microsoft.com** com a mesma conta.
2. Menu **Identidade → Aplicativos → Registros de aplicativo → + Novo registro**.
3. Preencha:
   - **Nome:** `Auxílio-Saúde` (é o nome que aparece na tela de permissão).
   - **Tipos de conta com suporte:** *Contas em qualquer diretório organizacional e contas pessoais da Microsoft*.
   - **URI de redirecionamento:** em "Selecionar uma plataforma", escolha **Aplicativo de página única (SPA)** e cole o endereço da Parte 1, com a barra no final.
4. Clique em **Registrar**.
5. Na tela **Visão geral**, copie o **ID do aplicativo (cliente)**, um código parecido com `1a2b3c4d-1234-5678-9abc-def012345678`.

### 2.3 Permissões (confira)

Em **Permissões de API**, deixe estas permissões **delegadas** do Microsoft Graph (use **+ Adicionar uma permissão → Microsoft Graph → Permissões delegadas** para incluir as que faltarem):

- `User.Read`: mostrar nome e e-mail de quem entrou (já vem por padrão)
- `Files.ReadWrite`: ler as notas e gravar os dados no OneDrive do usuário
- `offline_access`: manter a pessoa conectada

Nenhuma dessas exige aprovação de administrador para contas pessoais. **Não** crie "segredo do cliente": app de página única não usa segredo.

### 2.4 Identidade visual (recomendado)

Em **Identidade visual e propriedades** (Branding & properties):

- **Logotipo:** envie o `icon-512.png`.
- **URL da página inicial:** o endereço da Parte 1.
- **URL dos Termos de Serviço:** endereço + `privacidade.html#termos`
- **URL da declaração de privacidade:** endereço + `privacidade.html`

Clique em **Salvar**.

---

## Parte 3 — Ligar o login (colar o ID)

1. No GitHub, abra o arquivo **`config.js`** e clique no lápis (**Edit this file**).
2. Cole o ID entre as aspas:

   ```js
   window.AUX_CONFIG = {
     msClientId: "1a2b3c4d-1234-5678-9abc-def012345678"
   };
   ```

3. Clique em **Commit changes**. Em 1 ou 2 minutos o site atualiza.

### Testar

1. Abra o endereço do site no celular ou no computador.
2. Toque em **Entrar com Microsoft**, entre com uma conta pessoal e aceite as permissões. Se o navegador bloquear a janela, permita pop-ups para o site.
3. Confira no OneDrive se apareceu a pasta **Auxilio Saude** com o arquivo `dados_auxilio_saude.json`.
4. Instale o atalho:
   - **Android:** botão "Instalar o atalho" na tela de entrada (ou Chrome ⋮ → Instalar app)
   - **iPhone:** abra no Safari → Compartilhar → Adicionar à Tela de Início
   - **Computador:** Chrome ou Edge → ícone de instalar na barra de endereço

Pronto. É só divulgar o endereço.

---

## Parte 4: Código de acesso (quem pode usar)

O app é gratuito, mas só funciona com um **código individual** gerado por você. O código traz o nome e o e-mail da pessoa e é assinado com a sua chave secreta. O app confere a assinatura e exige que o e-mail do código seja o mesmo da conta Microsoft que entrou. Assim, um código repassado para outra pessoa não funciona.

**Liga e desliga no `config.js`:**

```js
exigirCodigo: true,     // false = qualquer pessoa usa, sem código
diasTeste: 0,           // ex.: 7 = a pessoa usa 7 dias antes de precisar do código
vincularEmail: true,    // o código só vale na conta Microsoft com o mesmo e-mail
contato: "Peça o seu código de acesso ao responsável pelo app.",
whatsapp: "5585999999999",      // aparece o botão "Pedir pelo WhatsApp" (opcional)
emailContato: "seu@email.com",  // aparece o botão "Pedir por e-mail" (opcional)
```

**Para liberar uma pessoa:**

1. A pessoa entra no app com a conta Microsoft dela. A tela "Código de acesso" mostra o e-mail exato da conta, e o botão de WhatsApp ou e-mail já manda nome e e-mail para você.
2. Abra no seu computador o arquivo **`gerador-de-codigos-PRIVADO.html`**, preencha nome e **esse mesmo e-mail** e clique em **Gerar código**.
3. Clique em **Copiar com instruções** e mande para a pessoa. Ela cola o código no app, e pronto.

**Sua lista de usuários** fica na tabela "Códigos gerados" do gerador. Ela fica guardada **só no navegador onde você abriu o gerador**, então use **Baixar lista (CSV)** de vez em quando como cópia.

**Para cortar o acesso de alguém:** gere os códigos com data em **Válido até** (por exemplo, 1 ano) e não renove. Um código sem data de vencimento não pode ser cancelado depois, porque o app confere tudo no próprio aparelho, sem servidor.

> ⚠️ **O gerador nunca vai para o GitHub.** Ele contém a chave secreta: quem tiver esse arquivo cria códigos à vontade. Guarde-o fora da pasta do site, com uma cópia de segurança, por exemplo num pen drive ou no seu OneDrive pessoal.

---

## Parte 5: Contador de uso (GoatCounter, gratuito)

Mostra quantas pessoas abrem o app, sem coletar nome nem e-mail e sem cookies.

1. Acesse **goatcounter.com** e clique em **Sign up**. É gratuito para uso não comercial.
2. Em **Code**, escolha um nome, por exemplo `auxiliosaude`. Seu painel será `https://auxiliosaude.goatcounter.com`.
3. Preencha e-mail e senha e confirme o cadastro pelo e-mail.
4. No `config.js`, preencha `goatcounter: "auxiliosaude"` e faça **Commit changes**.

No painel aparecem:

| Item | O que significa |
|---|---|
| `/navegador` | Aberturas do app pelo navegador |
| `/atalho` | Aberturas pelo atalho instalado na tela inicial |
| `entrou` / `saiu` | Logins e saídas de conta |
| `codigo-ativado` / `codigo-recusado` | Códigos de acesso aceitos e recusados (recusa costuma ser e-mail diferente) |
| `instalou` | Atalhos instalados (só Android e computador; o iPhone não avisa) |

O GoatCounter conta visitantes únicos por dia de forma aproximada. Para saber **quem** usa, a referência é a lista do gerador de códigos.

---

## Quando der erro no login

| Mensagem | Causa e solução |
|---|---|
| "O login da Microsoft ainda não foi configurado" | O `config.js` está sem o ID, ou o site ainda não atualizou. Confira o arquivo e espere 2 minutos. |
| `AADSTS50011` (redirect URI não corresponde) | O endereço registrado na Parte 2 está diferente do site. Ele tem que ser idêntico, com `https://` e a barra no final, e na plataforma **SPA** (não "Web"). |
| `AADSTS9002326` (cross-origin token redemption) | O endereço foi cadastrado na plataforma **Web**. Apague-o e cadastre na plataforma **Aplicativo de página única (SPA)**. |
| `AADSTS700016` (aplicativo não encontrado) | O ID colado está errado, ou o tipo de conta do registro não inclui contas pessoais. |
| "Precisa de aprovação do administrador" | A pessoa entrou com conta **de trabalho ou escola**, e a organização dela bloqueia apps não verificados. Oriente-a a usar uma conta pessoal, ou peça a aprovação à TI da organização. |
| A janela da Microsoft não abre | O navegador bloqueou o pop-up. Permita pop-ups para o site. O app também tenta seguir pela própria página. |

---

## Publicar uma atualização

1. Edite ou substitua o arquivo no GitHub e faça **Commit changes**. **Não substitua o `config.js`** por um novo, porque isso apaga o seu ID e as suas configurações. Edite só as linhas que mudaram.
2. Se mudou o `index.html`, abra o `sw.js` e aumente o número da versão (por exemplo, `auxilio-onedrive-v1` → `auxilio-onedrive-v2`). Assim os atalhos já instalados baixam a versão nova.

## Opcional: verificação de editor (contas de trabalho)

Contas pessoais funcionam sem isso. Para que contas de **trabalho** de outras organizações consigam entrar sem pedir aprovação da TI, a Microsoft exige a "verificação de editor" (Publisher verification). Ela é gratuita, mas pede um ID do programa de parceiros da Microsoft (Microsoft AI Cloud Partner Program) e um domínio próprio verificado. Vale a pena só se o público for majoritariamente de contas corporativas.

## Custos

GitHub Pages, conta Azure gratuita e registro no Entra não custam nada. A leitura por IA usa a chave do Gemini de cada usuário, com cota gratuita, na conta dele.
