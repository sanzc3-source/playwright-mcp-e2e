pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        COMPOSE_PROJECT_NAME = "pw-${env.BUILD_NUMBER}"
        COMPOSE = 'docker compose -f docker-compose.yml -f docker-compose.jenkins.yml'
    }

    stages {
        stage('Clone app under test') {
            steps {
                sh '''
                    rm -rf ../cypress-realworld-app
                    git clone --depth 1 --branch develop https://github.com/sanzc3-source/cypress-realworld-app.git ../cypress-realworld-app
                '''
            }
        }

        stage('Run tests in Docker Compose') {
            steps {
                sh '$COMPOSE up --build --abort-on-container-exit --exit-code-from playwright'
            }
        }
    }

    post {
        always {
            sh '''
                rm -rf test-results playwright-report
                mkdir -p test-results playwright-report
                docker cp $($COMPOSE ps -a -q playwright):/app/test-results/. test-results/ || true
                docker cp $($COMPOSE ps -a -q playwright):/app/playwright-report/. playwright-report/ || true
            '''
            junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
            archiveArtifacts artifacts: 'playwright-report/**, test-results/**', allowEmptyArchive: true
            sh '$COMPOSE down -v --rmi local || true'
        }
    }
}