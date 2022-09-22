pipeline{
    agent any
    environment {
       BACK_CONTAINER_NAME="rideus_back_container"
       BACK_NAME = "rideus_back"

       FRONT_CONTAINER_NAME="rideus_front_container"
       FRONT_NAME = "rideus_front"
    }
    stages {
        stage('Clean'){
            steps{
                script {
                    try{
                        sh "docker stop ${BACK_CONTAINER_NAME}"

                        sleep 1
                        sh "docker rm ${BACK_CONTAINER_NAME}"

                    }catch(e){
                        sh 'exit 0'
                    }
                }
            }
        }
        stage('Build') {
            steps {
                script{
                    sh "docker build -t ${BACK_NAME} ./backend/."

                }
            }
        }
        stage('Deploy'){
            steps {
                sh "docker run -d --name=${BACK_CONTAINER_NAME} -p 8080:8080 ${BACK_NAME}"
  

                sh "docker image prune --force"
            }
        }
    }
}