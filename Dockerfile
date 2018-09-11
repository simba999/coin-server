FROM node:carbon

USER root

WORKDIR /api
COPY package*.json /api/
COPY copyStaticAssets.ts /api/
COPY LICENSE /api/
COPY ts*.json /api/
COPY README.md /api/
COPY .env /api/

#RUN echo ENV=local \
#URL=http://localhost:80 \
#DEBUG=ishu:* \
#PORT=80 \
##DATABASE_URI=mysql://root:password@localhost/ishu_local \
##DATABASE_URI=postgres://postgres:admin@localhost:5432/ishu_local \
#DATABASE_URI=postgres://ishu:D@[8E=P3Yid829}6@35.202.219.206:5432/ishu_dev \
#DATABASE_LOGGIN=true \
##SMTP_HOST=smtp.mailtrap.io \
##SMTP_USERNAME=09ca7f26c7bddb \
##SMTP_PASSWORD=6916d905323c01 \
##SMTP_PORT=587 \
#SMTP_HOST=smtp.mailgun.org \
#SMTP_PORT=587 \
#SMTP_USERNAME=postmaster@sandboxf52c84a9e6f8431eb9f9fc1e82fdd263.mailgun.org \
#SMTP_PASSWORD=1d7fadc6493348ac993fc3550733a5e8-7efe8d73-15a5738d > .env 

COPY src /api/src
RUN npm install
RUN npm run build
RUN npm install pg
RUN npm install truffle-contract

EXPOSE 80
ENTRYPOINT npm run serve
