pipeline {
    agent {
        docker {
            image 'ange10k/angularcli' 
        }
    }
    stages {
          stage('Test') {
            steps {
                sh 'npm install'
                sh 'npm run test'
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