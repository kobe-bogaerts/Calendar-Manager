pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }
        stage('Build') {
            steps {
                sh '''#!/bin/bash
                    npm install
				'''
            }
        }
        stage('Test') {
            steps {
                sh '''#!/bin/bash
                    npm run test
				'''
            }
        }
        stage('Build') { 
            steps {
                withCredentials([string(credentialsId: 'Pass-Decrypting', variable: 'SECRET')]) {
                    echo 'Building'
                    echo "My secret text is '${SECRET}'"
                }
            }
        }
        stage('Deploy') {
            when {
                expression {
                    currentBuild.result == null || currentBuild.result == 'SUCCESS' 
                }
            }
            steps {
                echo 'deploying'
            }
        }
    }
}