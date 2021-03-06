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
                    sh 'cd ./app && ng build --prod --outputPath=../deployDocker/web'
                }
            }
        }
        stage('Upload') {
            when {
                expression {
                    currentBuild.result == null || currentBuild.result == 'SUCCESS' 
                }
            }
            steps {
                dir('./deployDocker'){
                    script{
                        docker.withRegistry('https://registry.hub.docker.com', 'docker-cred') {
                            def customImage = docker.build('kobeap/calendar-manager:latest')
                            customImage.push()
                        }
                    }
                }
            }
        }
        stage('Deploy') {
            agent none
            
            steps {
                script{
                    withCredentials([usernamePassword(credentialsId: 'ansible', passwordVariable: 'pass', usernameVariable: 'user')]) {
                        ansiblePlaybook(
                            inventory: './hosts.txt',
                            playbook: './install_staging.yml',
                            credentialsId: 'ansible',
                            disableHostKeyChecking: true,
                            extraVars: [ansible_sudo_pass: "${pass}"]
                        )
                        def productionFlag = input(id: 'productionOption', message: 'Do you want to deploy to production?',    
                            parameters: [[$class: 'BooleanParameterDefinition', defaultValue: false, description: '', name: 'Check if you want to deploy to PRODUCTION']])
                        
                        if (productionFlag) {
                            ansiblePlaybook(
                                inventory: './hosts.txt',
                                playbook: './install_production.yml',
                                credentialsId: 'ansible',
                                disableHostKeyChecking: true,
                                extraVars: [ansible_sudo_pass: "${pass}"]
                            )
                        }
                    }
                }
            }
        }
    }
}