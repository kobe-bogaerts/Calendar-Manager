pipeline {
   agent {
        docker {
            image 'kolllor3/jenkins-node-angularcli:latest'
        }
    }
    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }
        stage('Install deps') {
            steps {
                sh 'cd ./app && npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'cd ./app && npm run test'
            }
        }
        stage('Build') { 
            steps {
                withCredentials([string(credentialsId: 'Pass-Decrypting', variable: 'SECRET')]) {
                    echo 'Building'
                    sh "cd ./app && node ./setupEnv.js '${SECRET}'"
                    sh 'cd ./app && cat ./src/environments/environment.prod.ts'
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