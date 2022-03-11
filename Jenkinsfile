pipeline {
    agent any
    options {
        skipDefaultCheckout(true)
    }
    tools {
        dockerTool 'docker-latest'
    }
    environment {
        GITHUB_PRIVATE_KEY = credentials('711f2cf7-3456-4632-93cb-182d3583f65f')
    }
    stages {
        stage('Prepare') {
            steps{
                cleanWs()
                checkout scm
            }
        }
        stage('Build Docker Image and Push') {
            steps{
                sh 'docker build -t registry.makerhub.io:5000/frontend .'
                sh 'docker push registry.makerhub.io:5000/frontend'
            }
        }
    }
}