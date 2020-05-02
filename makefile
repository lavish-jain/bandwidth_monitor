SHELL := /bin/bash
PROJECT := bandwidthmonitor
BANDWIDTH_MONITOR_PERIOD := $(if ${BANDWIDTH_MONITOR_PERIOD},${BANDWIDTH_MONITOR_PERIOD},1D)
define conf_file
[Service]
Environment="BANDWIDTH_MONITOR_PERIOD=${BANDWIDTH_MONITOR_PERIOD}"
Environment="HOME=${HOME}"
endef
export conf_file

all: install

install:
	@echo Installing ${PROJECT} module...
	sudo npm install -g
	@echo Setting up BANDWIDTH_MONITOR_PERIOD in the service conf file...
	@sudo mkdir -p /etc/systemd/system/${PROJECT}.service.d
	@printf "$$conf_file" | sudo tee /etc/systemd/system/${PROJECT}.service.d/local.conf > /dev/null
	@echo Done
	@echo Copying ${PROJECT}.service file to systemd...
	@sudo cp ${PROJECT}.service /lib/systemd/system/${PROJECT}.service
	@echo Done
	@echo Reloading daemon...
	@sudo systemctl daemon-reload
	@echo Done
	@echo Starting ${PROJECT} service with ${BANDWIDTH_MONITOR_PERIOD} as the frequency
	@sudo systemctl start ${PROJECT}.service
	@echo Done
	@echo Enabling ${PROJECT} 
	@sudo systemctl enable ${PROJECT}.service
	@echo Done
	@echo ${PROJECT} succesfully installed and started!

clean:
	@echo Stopping ${PROJECT}.service...
	@sudo systemctl stop ${PROJECT}.service
	@echo Done
	@echo Disabling ${PROJECT}.service...
	@sudo systemctl disable ${PROJECT}.service 
	@echo Done
	@echo Deleting ${PROJECT}.service...
	@sudo rm /lib/systemd/system/${PROJECT}.service
	@echo Done
	@echo Reloading daemon...
	@sudo systemctl daemon-reload
	@echo Done
	@sudo rm -r /etc/systemd/system/${PROJECT}.service.d
	@echo Uninstalling ${PROJECT} module...
	sudo npm uninstall -g
	@echo Done
	@echo Removing bandwidth.tmp file...
	@sudo rm -f ${HOME}/bandwidth.tmp
	@echo Done
	@echo Successfully uninstalled ${PROJECT}!

update: 
	@printf "$$conf_file" | sudo tee /etc/systemd/system/${PROJECT}.service.d/local.conf > /dev/null
	@echo Done
	@echo Reloading daemon...
	@sudo systemctl daemon-reload
	@echo Done
	@echo Restarting ${PROJECT} service with ${BANDWIDTH_MONITOR_PERIOD} as the frequency
	@sudo systemctl restart ${PROJECT}.service
	@echo Done