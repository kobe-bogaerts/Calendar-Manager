pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }
        stage('Install deps') {
            steps {
                withNPM(npmrcConfig:'my-custom-npmrc') {
                    sh 'npm install -g @angular/cli@8.3.17'
                    sh 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
                withNPM(npmrcConfig:'my-custom-npmrc') {
                    sh 'npm run test'
                }
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