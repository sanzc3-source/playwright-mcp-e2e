pipeline {
    agent any

    options {
        timeout(time: 45, unit: 'MINUTES')
        timestamps()
    }

    environment {
        COMPOSE = 'docker compose -f docker-compose.yml -f docker-compose.jenkins.yml'
    }

    stages {
        stage('Clone app under test') {
            steps {
                sh '''
                    rm -rf ../cypress-realworld-app
                    git clone --depth 1 --branch develop https://github.com/sanzc3-source/cypress-realworld-app.git ../cypress-realworld-app
                    rm -rf shard-* test-results playwright-report
                '''
            }
        }

        stage('Run shards in parallel') {
            steps {
                script {
                    def total = 3
                    def shards = [:]
                    for (int i = 1; i <= total; i++) {
                        def n = i
                        shards['Shard ' + n] = {
                            withEnv(["SHARD_N=${n}", "COMPOSE_PROJECT_NAME=pw-${env.BUILD_NUMBER}-s${n}", "PW_ARGS=--shard=${n}/${total} --workers=1 --retries=2"]) {
                                // Stagger starts so the app cold starts do not all compete at once
                                sleep time: (total - n) * 45, unit: 'SECONDS'
                                try {
                                    sh '$COMPOSE up --build --abort-on-container-exit --exit-code-from playwright'
                                } finally {
                                    sh '''
                                        mkdir -p shard-$SHARD_N/test-results shard-$SHARD_N/playwright-report
                                        docker cp $($COMPOSE ps -a -q playwright):/app/test-results/. shard-$SHARD_N/test-results/ || true
                                        docker cp $($COMPOSE ps -a -q playwright):/app/playwright-report/. shard-$SHARD_N/playwright-report/ || true
                                        $COMPOSE down -v --rmi local || true
                                    '''
                                }
                            }
                        }
                    }
                    parallel shards
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'shard-*/test-results/junit.xml'
            archiveArtifacts artifacts: 'shard-*/**', allowEmptyArchive: true
        }
    }
}
