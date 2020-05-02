# Bandwidth Monitor
> A linux cli tool that calculates total bandwidth used by your system and periodically updates the stats in a file

## Requirements
```sh
Node 13.0.0 and above
```
```sh
Linux based operating system
```

## Installation

```sh
git clone https://github.com/lavish-jain/bandwidth_monitor.git
cd bandwidth_monitor
# Default installation: Calculation frequency set at 1 Day:
make
# Or, you can set the calculation frequency at time of installation (see frequency syntax below). For eg, we set period as 1 day and 12 hours:
make BANDWIDTH_MONITOR_PERIOD=1D12h
```

## Time Frequency Syntax
The application accepts time period in Years, Months, Days, Hours, Minutes and Seconds. The default period is set at 1 Day. The following symbols are used to represent various timespans. Note that the symbols are case sensitive. If an invalid time is given, the default time period is used.

| Timespan | Symbol | Timespan | Symbol |
| -------- | ------ | -------- | ------ |
|   Year   |    Y   |   Hour   |    h   |
|   Month  |    M   |  Minute  |    m   |
|    Day   |    D   |  Second  |    s   |

Here are a few examples:
```sh
# 1 minute
1m
# 5 days
5D
# 2 years 3 months 7 days 5 hours 8 minutes 20 seconds
2Y3M7D5h8m20s
# If the time overflows, it is automatically added to next higher unit. For eg, 75m = 1h15m
300s #Equivalent to 5m
```
## Usage example

Once installed, the app will run as a systemd service and update your bandwidth usage periodically.
The bandwidth data will be updated in the following directory:
```sh
$HOME/Desktop/bandwidth_monitor_stats.txt
```
You can stop the service by using the following command:
```sh
sudo systemctl stop bandwidthmonitor.service
```
To update the bandwidth calculation frequency, use the following command:
```sh
cd path/to/bandwidth_monitor_repo
# Change period to 2 hours
make update BANDWIDTH_MONITOR_PERIOD=2h
# This also works, but the time period will reset to default (1 Day)
make update
```

## Meta

Lavish Jain – lavishrjain1997@gmail.com

Distributed under the XYZ license. See ``LICENSE`` for more information.

[https://github.com/lavish-jain/bandwidth_monitior](Github Repo Link)

## Contributing

1. Fork it (<https://github.com/lavish-jain/bandwidth_monitior/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
