from openai import OpenAI
from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente
load_dotenv()
openai = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo de Paciente
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    condition = db.Column(db.String(200), nullable=False)

# Rota inicial
@app.route('/')
def index():
    return render_template('index.html')  # Renderiza o template index.html

# Rota para o Dashboard
@app.route('/dashboard')
def dashboard():
    patients = Patient.query.all()  # Busca todos os pacientes no banco de dados
    return render_template('dashboard.html', patients=patients)

# Rota para exibir o formulário de cadastro
@app.route('/add', methods=['GET', 'POST'])
def add_patient():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        condition = request.form['condition']

        # Criação de um novo paciente
        new_patient = Patient(name=name, email=email, condition=condition)
        db.session.add(new_patient)
        db.session.commit()
        return redirect(url_for('dashboard'))  # Redireciona para o Dashboard após o cadastro

    return render_template('add_patient.html')  # Renderiza o formulário

# Rota para o chat com IA
@app.route('/chat/<int:patient_id>', methods=['GET', 'POST'])
def chat(patient_id):
    patient = Patient.query.get_or_404(patient_id)  # Busca o paciente pelo ID
    messages = []

    if request.method == 'POST':
        user_message = request.form['message']
        messages.append({'role': 'user', 'content': user_message})

        # Envia a mensagem para a OpenAI e obtém a resposta
        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": f"Você é um assistente médico especializado. O paciente tem a seguinte condição médica: {patient.condition}."},
                    {"role": "user", "content": user_message}
                ]
            )
            ai_message = response['choices'][0]['message']['content']
            messages.append({'role': 'assistant', 'content': ai_message})
        except Exception as e:
            ai_message = "Erro ao se comunicar com a IA. Por favor, tente novamente."
            messages.append({'role': 'assistant', 'content': ai_message})

    return render_template('chat.html', patient=patient, messages=messages)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Cria as tabelas no banco de dados
    app.run(debug=True)
