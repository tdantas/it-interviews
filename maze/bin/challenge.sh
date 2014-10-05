#! /bin/bash

SEED=664
EVENTS=1000
CONCURRENCY=6

time java -server -XX:-UseConcMarkSweepGC -Xmx2G -jar ./challenge.jar $SEED $EVENTS $CONCURRENCY
