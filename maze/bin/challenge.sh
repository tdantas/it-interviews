#! /bin/bash

SEED=664
EVENTS=4
CONCURRENCY=3

time java -server -XX:-UseConcMarkSweepGC -Xmx2G -jar ./challenge.jar $SEED $EVENTS $CONCURRENCY
