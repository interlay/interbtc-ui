pipeline {
    agent {
      kubernetes {
        //cloud 'kubernetes'
        defaultContainer 'node'
        yaml """
  kind: Pod
  spec:
    containers:
    - name: node
      image: node:15.7.0
      command:
      - cat
      tty: true
    - name: kaniko
      image: gcr.io/kaniko-project/executor:debug
      imagePullPolicy: Always
      command:
        - /busybox/cat
      tty: true
      securityContext:
        allowPrivilegeEscalation: false
      volumeMounts:
        - name: jenkins-docker-cfg
          mountPath: /kaniko/.docker
    volumes:
      - name: jenkins-docker-cfg
        projected:
          sources:
            - secret:
                name: gitlab-polkabtc-ui-registry
                items:
                  - key: .dockerconfigjson
                    path: config.json
  """
      }
    }
    environment {
        CI = 'true'
        DISCORD_WEBHOOK_URL = credentials('discord_webhook_url')
    }
    stages {
        stage('Prepare') {
            steps {
              sh script: 'apt-get update && apt-get install -y libusb-1.0-0-dev libudev-dev', label: 'Install linux dependencies'
//              sh "ln -s .env.${BRANCH:dev} .env"
              sh 'yarn install'
              sh 'yarn lint'
            }
        }
        stage('Test') {
            steps {
                sh 'yarn test --passWithNoTests'
            }
        }
        stage('Build') {
          steps {
            sh 'yarn build --production'
            stash(name: 'yarn_build', includes: 'DockerfileProd, nginx.conf, build/')
          }
        }
        stage('Build docker image') {
            environment {
                PATH        = "/busybox:$PATH"
                REGISTRY    = 'registry.gitlab.com' // Configure your own registry
                REPOSITORY  = 'interlay'
                IMAGE       = 'polkabtc-ui'
            }
            steps {
                container(name: 'kaniko', shell: '/busybox/sh') {
                    dir('unstash') {
                        unstash("yarn_build")
                        sh '''#!/busybox/sh
                        /kaniko/executor -f `pwd`/DockerfileProd -c `pwd` \
                            --destination=${REGISTRY}/${REPOSITORY}/${IMAGE}:${BRANCH} \
                            --destination=${REGISTRY}/${REPOSITORY}/${IMAGE}:${BRANCH}-${GIT_COMMIT:0:6}
                        '''
                    }
                }
            }
        }
    }
    post {
      always {
        discordSend description: "Jenkins Pipeline Build", footer: "Footer Text", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: env.DISCORD_WEBHOOK_URL
      }
    }
}
