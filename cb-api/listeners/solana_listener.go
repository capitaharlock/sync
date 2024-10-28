package listeners

import (
    "cb-api/queue"
)

type SolanaListener struct {
    url string
    queue *queue.Queue
}

func NewSolanaListener(url string, q *queue.Queue) *SolanaListener {
    return &SolanaListener{
        url: url,
        queue: q,
    }
}

func (l *SolanaListener) Start() {
    // Implementation to start listening to Solana events
}
