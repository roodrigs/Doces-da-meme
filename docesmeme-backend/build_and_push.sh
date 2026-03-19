#!/bin/bash

# Emojis para melhor visualização
CHECK="✔️"
ERROR="❌"
INFO="ℹ️"
DOCKER="🐳"

# Verifica se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
  echo -e "${ERROR} Docker não está rodando. Por favor, inicie o Docker e tente novamente."
  exit 1
fi

# Define o registry
REGISTRY="192.168.192.23:5000"

# Obtém o nome da pasta atual
CURRENT_DIR=$(basename "$PWD")

# Pergunta o ambiente ao usuário
echo -e "${INFO} Selecione o ambiente:"
echo "1) DEV 🛠️"
echo "2) HOM 🏡"
echo "3) PROD 🚀"
read -p "Escolha o ambiente (1/2/3): " ENV_OPTION

# Define o prefixo do ambiente com base na escolha
case $ENV_OPTION in
  1)
    ENV_PREFIX="dev" ;;
  2)
    ENV_PREFIX="hom" ;;
  3)
    ENV_PREFIX="prod" ;;
  *)
    echo -e "${ERROR} Opção inválida. Saindo."
    exit 1 ;;
esac

# Constrói o nome da imagem
IMAGE_NAME="${ENV_PREFIX}/${CURRENT_DIR}"

# Lê a versão do usuário
echo -e "${INFO} Informe a versão da imagem:"
read -p "→ " VERSION
VERSION=$(echo "$VERSION" | tr -d -c '[:alnum:].-_')
if [ -z "$VERSION" ]; then
  echo -e "${ERROR} Versão é obrigatória. Saindo."
  exit 1
fi

# Constrói a imagem Docker
echo -e "${DOCKER} Construindo imagem Docker..."
docker build -t ${REGISTRY}/${IMAGE_NAME}:${VERSION} .

echo -e "${INFO} Versionando imagem Docker..."
docker tag ${REGISTRY}/${IMAGE_NAME}:${VERSION} ${REGISTRY}/${IMAGE_NAME}:latest

echo -e "${INFO} Salvando imagem no registry..."
docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}

echo -e "${INFO} Atualizando imagem 'latest'..."
docker push ${REGISTRY}/${IMAGE_NAME}:latest

echo -e "${CHECK} Processo de build e push concluído com sucesso!"
exit 0
