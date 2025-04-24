package pkg

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	Client   *mongo.Client
	Db_Trace *mongo.Database
	Coll_Log *mongo.Collection
)

const logDbUri = "mongodb://trace:sP8cV1tR2oY0mJ0h@trace.easit.jp:27017/trace?authSource=admin"

func init() {
	var err error

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	Client, err = mongo.Connect(ctx, options.Client().ApplyURI(logDbUri))
	if err != nil {
		log.Fatalf("Init MongoDB: 创建 Connect 失败, %v", err)
	}
	err = Client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("Init MongoDB: 尝试Ping服务器失败, %v", err)
	}

	Db_Trace = Client.Database("trace")
	// Coll_Log = Db_Trace.Collection("log")
	Coll_Log = Db_Trace.Collection("easbnb-prod")

	fmt.Println("MongoDB连接成功")
}
