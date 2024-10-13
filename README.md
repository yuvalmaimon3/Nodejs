# Nodejs
This project minitioring Nodejs server with Prometheus and use Grafana to create alerts and dashboard.
Architecture and Resources
Each service run in a dedecated VM(EC2) in AWS. i.e

1 VM for Nodejs 

1 VM run Prometheus in docker container 

1 VM run Grafana in docker container 





Nodejs:

The Nodejs server use NASA API (https://api.nasa.gov/) to collect data from NASA.

Prometheus:

Prometheus used to collect data about the Nodejs server and about the Nodejs application.
At the Nodejs server Prometheus client installed with "npm install prom-client" command.

Grafana:

Grafana use Prometheus as a data source to create dashboad and alerts about the Nodejs server.

Networking and secutrity 
to ensure secure communication those roles added to the security group 
Allow Prometheus vm inbound role to Nodejs vm (i.e allow Prometheus ip access to port 3000)
Allow Grfana vm inbound role to Prometheus vm (i.e allow Grafana ip access to port 9090)
Allow my ip inboud roll TCP ports 9090 and 3000


Grafana dahsboad example 
![grafana dashboard](https://github.com/user-attachments/assets/f7f74d93-5400-45ed-b6d8-16eefbc03e20)

Grafana alert example
The alert send email message in case there are more than 7 http request in 5 min.
As you can see in condition A Prometheus as a data source.
![grafana alert](https://github.com/user-attachments/assets/1abf9c1e-e5f3-4919-9de8-37c6c55eadb0)
![alert email message](https://github.com/user-attachments/assets/1c4bd426-1a84-4abf-bc0f-c742d76c48e2)

