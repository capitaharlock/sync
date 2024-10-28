package queue

import (
    "sync"
)

type Queue struct {
    items []interface{}
    lock  sync.Mutex
}

func New() *Queue {
    return &Queue{
        items: make([]interface{}, 0),
    }
}

func (q *Queue) Enqueue(item interface{}) {
    q.lock.Lock()
    defer q.lock.Unlock()
    q.items = append(q.items, item)
}

func (q *Queue) Dequeue() interface{} {
    q.lock.Lock()
    defer q.lock.Unlock()
    if len(q.items) == 0 {
        return nil
    }
    item := q.items[0]
    q.items = q.items[1:]
    return item
}
