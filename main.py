#!/usr/bin/env python3
import typer
from typing import Optional

app = typer.Typer(
    name="farm-game-cli",
    help="Command line interface for Farm Game development and management"
)

@app.command()
def build(
    prod: bool = typer.Option(False, "--prod", "-p", help="Build for production"),
    watch: bool = typer.Option(False, "--watch", "-w", help="Watch files for changes")
):
    """Build the game project"""
    if prod and watch:
        raise typer.BadParameter("Cannot use --prod and --watch together. Use one or the other.")
    
    if prod:
        typer.echo("Building for production...")
    elif watch:
        typer.echo("Starting development server with hot reload...")
    else:
        typer.echo("Building in development mode...")

@app.command()
def serve():
    """Start development server"""
    typer.echo("Starting development server on http://localhost:3000")

@app.command()
def test(
    unit: bool = typer.Option(False, "--unit", "-u", help="Run unit tests"),
    e2e: bool = typer.Option(False, "--e2e", "-e", help="Run end-to-end tests"),
    coverage: bool = typer.Option(False, "--coverage", "-c", help="Generate test coverage report")
):
    """Run tests"""
    if not any([unit, e2e, coverage]):
        typer.echo("No test type specified. Run with --unit, --e2e, or --coverage.")
        raise typer.Exit(code=1)
    
    if unit:
        typer.echo("Running unit tests...")
    if e2e:
        typer.echo("Running end-to-end tests...")
    if coverage:
        typer.echo("Generating test coverage report...")

@app.command()
def deploy(
    env: str = typer.Option("staging", "--env", "-e", help="Deployment environment"),
    branch: Optional[str] = typer.Option(None, "--branch", "-b", help="Specific branch to deploy")
):
    """Deploy the game"""
    if branch:
        typer.echo(f"Deploying branch {branch} to {env} environment...")
    else:
        typer.echo(f"Deploying current state to {env} environment...")

@app.command()
def init():
    """Initialize project structure"""
    typer.echo("Initializing project structure...")

if __name__ == "__main__":
    typer.run(app)
