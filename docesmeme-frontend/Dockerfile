# Etapa 1: Build da aplicação
# Esta etapa não muda, ela compila seu código JS/TS para arquivos estáticos.
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------------------------------------------------------------------

# Etapa 2: Produção
# Usamos uma imagem limpa do Node para manter o tamanho final pequeno.
FROM node:18-alpine

# Define o diretório de trabalho final
WORKDIR /app

# Copia os arquivos estáticos compilados da etapa de 'builder'
COPY --from=builder /app/dist .

# Cria a pasta de uploads DENTRO do diretório que será servido.
# Isso é o mais importante.
RUN mkdir -p ./uploads

# Expõe a porta que será usada para acessar a aplicação
EXPOSE 4173

# Instala o 'serve' globalmente.
# Colocar este passo mais tarde aproveita o cache do Docker se só os arquivos mudarem.
RUN npm install -g serve

# Comando para iniciar o servidor.
# Ele serve o conteúdo do diretório atual (WORKDIR), que agora contém
# seus arquivos de app e a pasta 'uploads'.
CMD ["serve", "-s", ".", "-l", "4173"]
