package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	"net/http"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	_ "time"
	"encoding/json"
	"strconv"
)

type User struct {
  gorm.Model
  Name         string
}
type Room struct {
	gorm.Model
	Room_id      string
}
type Payment struct {
	gorm.Model
	Price        int32
	Room_id	     string
	User_id      uint
	What				 string
	Is_valid     bool
}

const (
	Dialect = "mysql"
	DBUser = "root"
	DBPass = "root"
	DBProtocol = "tcp(db:3306)"
	DBName = "sample"
)

func connectGorm() *gorm.DB {
	connectInfomationTemplate := "%s:%s@%s/%s?parseTime=true"
	connectInfomation := fmt.Sprintf(connectInfomationTemplate, DBUser, DBPass, DBProtocol, DBName)
	db, err := gorm.Open(Dialect, connectInfomation)
	if err != nil {
		panic(err.Error())
	}
	return db
}

func CORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
	w.Header().Set("Access-Control-Allow-Headers","Content-Type")
}

func selectUser(w http.ResponseWriter, r *http.Request) {
	db := connectGorm()
	defer db.Close()
	var users []User
	db.Order("id desc").Find(&users)

	w.Header().Set("Content-Type", "application/json")
	response, _ := json.Marshal(users)
	w.Write(response)
}

func createTable(w http.ResponseWriter, r *http.Request) {
	db := connectGorm()
	defer db.Close()
	db.Set("gorm:table_options", "ENGINE=InnoDB")
	db.AutoMigrate(&User{}, &Room{}, &Payment{})
}

func insertUser(w http.ResponseWriter, r *http.Request) {
	db := connectGorm()
	defer db.Close()
	var kahori = User{Name: "Kahori"}
	var mitsuaki = User{Name: "Mitsuaki"}
	db.Create(&kahori)
	db.Create(&mitsuaki)
}

func payment(w http.ResponseWriter, r *http.Request) {
	db := connectGorm()
	defer db.Close()
	r.ParseForm()
	price_i64, _ := strconv.ParseInt(r.Form.Get("price"), 10, 32)
	price := int32(price_i64)
	userId_uint64, _:= strconv.ParseUint(r.Form.Get("userId"), 10, 64)
	userId := uint(userId_uint64)
	what := r.Form.Get("what")
	var payment = Payment{Price: price, Room_id: "1", User_id: userId, What: what, Is_valid: true}
	db.Create(&payment)
}

func payments(w http.ResponseWriter, r *http.Request) {
	db := connectGorm()
	defer db.Close()
	var payments []Payment
	roomId := "1"
	db.Order("ID desc").Find(&payments, "Room_id = ?", roomId)
	w.Header().Set("Content-Type", "application/json")
	response, _ := json.Marshal(payments)
	CORS(w)
	w.Write(response)
}

func users(w http.ResponseWriter, r *http.Request) {
	db := connectGorm()
	defer db.Close()
	var users []User
	db.Find(&users)
	w.Header().Set("Content-Type", "application/json")
	response, _ := json.Marshal(users)
	CORS(w)
	w.Write(response)
}

func main() {
	//post: insert to Payment table, //TODO:delete: delete from Payment Table by PAYMENT_ID
	http.HandleFunc("/payment", payment)

	//get: payment list(is_valid include or not by flag), //TODO:update: is_valid = false
	http.HandleFunc("/payments", payments)

	http.HandleFunc("/users", users)

	//http.HandleFunc("/selectUser", selectUser)
	http.HandleFunc("/createTable", createTable)
	http.HandleFunc("/insertUser", insertUser)
	//http.HandleFunc("/dropTable", dropTable)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println(err)
	}
}
