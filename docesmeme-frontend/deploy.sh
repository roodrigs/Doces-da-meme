#!/bin/bash

# Função para exibir mensagens com ícones
progress() {
    echo -e "\e[1;34m⏳ $1...\e[0m"
}

success() {
    echo -e "\e[1;32m✅ $1!\e[0m"
}

error() {
    echo -e "\e[1;31m❌ $1!\e[0m"
}

# Listar os services disponíveis em ordem alfabética
progress "Listando services disponíveis..."
SERVICES=($(docker compose config --services | sort))
if [ ${#SERVICES[@]} -eq 0 ]; then
    error "Nenhum service encontrado. Saindo..."
    exit 1
fi

echo -e "\e[1;36mServices disponíveis:\e[0m"
for i in "${!SERVICES[@]}"; do
    echo "$((i+1))) ${SERVICES[i]}"
done

echo -e "\e[1;36mInforme o número do service para deploy:\e[0m"
read -r SERVICE_NUMBER

if ! [[ "$SERVICE_NUMBER" =~ ^[0-9]+$ ]] || [ "$SERVICE_NUMBER" -lt 1 ] || [ "$SERVICE_NUMBER" -gt ${#SERVICES[@]} ]; then
    error "Número inválido. Saindo..."
    exit 1
fi

SERVICE_NAME="${SERVICES[$((SERVICE_NUMBER-1))]}"

# Parar o contêiner, se estiver rodando
progress "Parando o contêiner $SERVICE_NAME"
docker stop $SERVICE_NAME &>/dev/null && success "Contêiner parado" || error "Falha ao parar o contêiner (pode já estar parado)"

# Remover o contêiner
progress "Removendo o contêiner $SERVICE_NAME"
docker rm $SERVICE_NAME &>/dev/null && success "Contêiner removido" || error "Falha ao remover o contêiner (pode já ter sido removido)"

# Remover a imagem
progress "Removendo a imagem $SERVICE_NAME"
docker rmi $SERVICE_NAME &>/dev/null && success "Imagem removida" || error "Falha ao remover a imagem (pode já ter sido removida)"

# Subir o contêiner novamente
progress "Iniciando o contêiner $SERVICE_NAME"
docker compose up -d $SERVICE_NAME &>/dev/null && success "Contêiner iniciado" || error "Falha ao iniciar o contêiner"

echo -e "\e[1;36m✨ Processo concluído!\e[0m"
