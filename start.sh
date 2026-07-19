#!/bin/zsh

PROJECT_DIR="$HOME/GitHub/MeshCore-Alberta"

echo "Opening Alberta MeshCore project..."

cd "$PROJECT_DIR" || {
    echo "Error: Project folder not found at $PROJECT_DIR"
    exit 1
}

if [ ! -d ".venv" ]; then
    echo "Error: Python virtual environment .venv was not found."
    echo "Create it with:"
    echo "python3 -m venv .venv"
    exit 1
fi

source .venv/bin/activate

echo "Virtual environment activated."

echo "Switching to the main branch..."
git switch main || exit 1

echo "Checking for updates from GitHub..."
git pull origin main || {
    echo "Warning: Git pull was not completed."
    echo "Check your internet connection or Git status."
}

echo "Verifying the custom domain..."
if [ -f "docs/CNAME" ]; then
    DOMAIN=$(tr -d '[:space:]' < docs/CNAME)

    if [ "$DOMAIN" = "albertamesh.ca" ]; then
        echo "Custom domain confirmed: albertamesh.ca"
    else
        echo "WARNING: docs/CNAME does not contain albertamesh.ca"
    fi
else
    echo "WARNING: docs/CNAME is missing."
fi

if command -v code >/dev/null 2>&1; then
    echo "Opening the project in Visual Studio Code..."
    code .
else
    echo "Visual Studio Code command 'code' was not found."
    echo "You can still edit the project manually."
fi

echo ""
echo "Alberta MeshCore project is ready."
echo "Project folder: $PROJECT_DIR"
echo ""
echo "To preview the website, run:"
echo "mkdocs serve"
echo ""
echo "To stop the preview server, press Control + C."
echo ""

exec /bin/zsh -i
