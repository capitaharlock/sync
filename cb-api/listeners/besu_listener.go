package listeners

import (
	"cb-api/queue"
	"context"
	"fmt"
	"log"
	"math/big"
	"strings"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

type BesuListener struct {
	url             string
	queue           *queue.Queue
	contractAddress string
}

type ObligationFullfiledEvent struct {
	Id      *big.Int
	Account common.Address
	Amount  *big.Int
}

const contractAbi = `[{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createObligation","inputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"account","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"token","type":"address","internalType":"address"},{"name":"beneficiary","type":"address","internalType":"address"},{"name":"expiration","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"expireObligation","inputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"index","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"fullFillObligation","inputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"index","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getObligationOfUser","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"index","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple","internalType":"struct Obligation.ObligationRecord","components":[{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"token","type":"address","internalType":"address"},{"name":"account","type":"address","internalType":"address"},{"name":"beneficiary","type":"address","internalType":"address"},{"name":"id","type":"uint256","internalType":"uint256"},{"name":"state","type":"uint8","internalType":"enum Obligation.ObligationState"},{"name":"expiration","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},{"type":"function","name":"initialize","inputs":[{"name":"_relayer","type":"address","internalType":"address"},{"name":"_minExpiration","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"isAllowanceSet","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"id","type":"uint256","internalType":"uint256"},{"name":"index","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"isObligationExpired","inputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"index","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"minimalExpiration","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"obligations","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"token","type":"address","internalType":"address"},{"name":"account","type":"address","internalType":"address"},{"name":"beneficiary","type":"address","internalType":"address"},{"name":"id","type":"uint256","internalType":"uint256"},{"name":"state","type":"uint8","internalType":"enum Obligation.ObligationState"},{"name":"expiration","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"relayer","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setMinimalExpiration","inputs":[{"name":"_minExpiration","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setRelayer","inputs":[{"name":"_relayer","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"Initialized","inputs":[{"name":"version","type":"uint64","indexed":false,"internalType":"uint64"}],"anonymous":false},{"type":"event","name":"ObligationFullfiled","inputs":[{"name":"id","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"error","name":"InvalidInitialization","inputs":[]},{"type":"error","name":"NotInitializing","inputs":[]},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]}]`

func NewBesuListener(url string, contractAddress string, q *queue.Queue) *BesuListener {
	return &BesuListener{
		url:             url,
		queue:           q,
		contractAddress: contractAddress,
	}
}

func (l *BesuListener) Start() {
	println("in start")

	log.Println("Starting Besu listener")
	log.Println("Connecting to Ethereum client at", l.url)
	log.Println("Contract address:", l.contractAddress)

	client, err := ethclient.Dial(l.url)
	if err != nil {
		log.Fatal("Failed to connect to the Ethereum client:", err)
	}

	parsedABI, err := abi.JSON(strings.NewReader(contractAbi))
	if err != nil {
		log.Fatal("Failed to parse contract ABI:", err)
	}

	query := ethereum.FilterQuery{
		Addresses: []common.Address{common.HexToAddress(l.contractAddress)},
	}

	logs, err := client.FilterLogs(context.Background(), query)
	if err != nil {
		log.Fatal("Failed to subscribe to logs:", err)
	}

	for _, logV := range logs {
		event := new(ObligationFullfiledEvent)

		err := parsedABI.UnpackIntoInterface(event, "ObligationFullfiled", logV.Data)
		if err != nil {
			log.Printf("Failed to unpack log data: %v", err)
			continue
		}

		event.Id = new(big.Int).Set(logV.Topics[1].Big())
		event.Account = common.BytesToAddress(logV.Topics[2].Bytes())

		fmt.Printf("ObligationFullfiled event: id=%v account=%v amount=%v\n", event.Id, event.Account, event.Amount)

		l.queue.Enqueue(event)
	}
}
