package ctl

import (
	"encoding/json"
	"log"
	"net/http"
	"trace-gui/pkg"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func writeResultToResponse(ctx *gin.Context, cursor *mongo.Cursor) {
	isWrote := false

outerLoop:
	for {
		select {
		case <-ctx.Done():
			if !isWrote {
				ctx.AbortWithStatusJSON(499, gin.H{
					"err": "Client Closed Request",
				})
			}
			return
		default:
			if cursor.Next(ctx) {
				var result bson.M
				if err := cursor.Decode(&result); err != nil {
					log.Println(err)
					break
				}
				jsonResult, err := json.Marshal(result)
				if err == nil {
					if isWrote {
						ctx.Writer.WriteString(",\n")
					} else {
						isWrote = true
						ctx.Writer.WriteString("[\n")
					}
					ctx.Writer.Write(jsonResult)
					ctx.Writer.Flush()
				}
			} else {
				break outerLoop // 退出外层循环
			}
		}
	}

	if isWrote {
		ctx.Writer.WriteString("\n]")
	} else if err := cursor.Err(); err != nil {
		ctx.AbortWithStatusJSON(500, gin.H{
			"err": "Cursor Error",
		})
	} else {
		ctx.AbortWithStatusJSON(404, gin.H{
			"err": "Not Found",
		})
	}
}

type SearchByIdReq struct {
	TraceId string `json:"traceid"`
}

func SearchById(ctx *gin.Context) {
	var req SearchByIdReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"err": "Invalid JSON",
		})
		return
	}

	query := bson.M{"traceid": req.TraceId}

	cursor, err := pkg.Coll_Log.Find(ctx, query)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"err": "Find Failed",
		})
		return
	}
	defer cursor.Close(ctx)

	writeResultToResponse(ctx, cursor)
}

func SearchByCond(ctx *gin.Context) {
	var query bson.M
	if err := ctx.ShouldBindJSON(&query); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"err": "Invalid JSON",
		})
		return
	}

	cursor, err := pkg.Coll_Log.Find(ctx, query,
		options.Find().SetLimit(101),
	)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"err": "Find Failed",
		})
		return
	}
	defer cursor.Close(ctx)

	writeResultToResponse(ctx, cursor)
}
