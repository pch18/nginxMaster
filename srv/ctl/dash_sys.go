package ctl

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/net"
)

const (
	nginxLogHistoryDefaultLines int64 = 200
	nginxLogHistoryMaxLines     int64 = 10000
	sysHistoryCount                   = 720
	sysHistoryInterval                = 5 * time.Second
)

var (
	sysHistory           = make([]SysInfo, 0, sysHistoryCount)
	sysHistoryReadLocker sync.Mutex
)

type SysInfo struct {
	Time     int64   `json:"t"`
	CpuPct   float64 `json:"c"`
	MemUsed  uint64  `json:"mu"`
	MemTotal uint64  `json:"mt"`
	NetSent  uint64  `json:"ns"`
	NetRecv  uint64  `json:"nr"`
}

func WriteToSysHistory(sysInfo SysInfo) {
	sysHistoryReadLocker.Lock()
	defer sysHistoryReadLocker.Unlock()
	if len(sysHistory) < sysHistoryCount {
		sysHistory = append(sysHistory, sysInfo)
	} else {
		sysHistory = sysHistory[1:]
		sysHistory = append(sysHistory, sysInfo)
	}
}

func SearchFromSysHistory(time int64) ([]SysInfo, int) {
	sysHistoryReadLocker.Lock()
	defer sysHistoryReadLocker.Unlock()

	if len(sysHistory) == 0 {
		return []SysInfo{}, 0
	}

	if time < sysHistory[0].Time {
		return sysHistory, len(sysHistory)
	}

	if time >= sysHistory[len(sysHistory)-1].Time {
		return []SysInfo{}, len(sysHistory)
	}

	for i := len(sysHistory) - 2; i >= 0; i-- {
		if time >= sysHistory[i].Time {
			return sysHistory[i+1:], len(sysHistory)
		}
	}

	return sysHistory, len(sysHistory)
}

func init() {
	go func() {
		for {
			var sysInfo SysInfo

			cpuPct, _ := cpu.Percent(sysHistoryInterval, false)
			if len(cpuPct) > 0 {
				sysInfo.CpuPct = cpuPct[0]
			}

			vmStat, _ := mem.VirtualMemory()
			sysInfo.MemUsed = vmStat.Used
			sysInfo.MemTotal = vmStat.Total

			netIOCounters, _ := net.IOCounters(false)
			if len(netIOCounters) > 0 {
				sysInfo.NetSent = netIOCounters[0].BytesSent
				sysInfo.NetRecv = netIOCounters[0].BytesRecv
			}

			sysInfo.Time = time.Now().UnixMilli()
			WriteToSysHistory(sysInfo)
		}
	}()
}

func GetSys(c *gin.Context) {
	var requestBody map[string]interface{}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid JSON",
		})
		return
	}

	lastTime, ok := requestBody["time"].(float64)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid lastTime",
		})
		return
	}

	list, total := SearchFromSysHistory(int64(lastTime))

	c.JSON(http.StatusOK, gin.H{
		"list":     list,
		"total":    total,
		"interval": sysHistoryInterval / time.Millisecond,
	})
}
