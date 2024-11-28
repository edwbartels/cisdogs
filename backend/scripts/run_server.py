import subprocess

if __name__ == "__main__":
    subprocess.run(["uvicorn", "app.main:app", "--reload", "--port", "8000"])
