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
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Build') { 
            steps {
                withCredentials([string(credentialsId: 'Pass-Decrypting', variable: 'SECRET')]) {
                    echo 'Building'
                    sh "node ./setupEnv.js '${SECRET}'"
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