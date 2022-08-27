<script setup>
import Chart from 'chart.js/auto'
import formatter from 'tools/formatter'
import { ref } from 'vue'

const chart = ref(null)

defineExpose({
  create(data) {
    new Chart(chart.value, {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'Margen',
            data,
            backgroundColor: 'rgba(255, 99, 132, 0)',
            borderColor: 'rgba(255, 99, 132, 0)',
            borderWidth: 0,
            yAxisID: 'y1',
            parsing: {
              xAxisKey: 'week',
              yAxisKey: 'margin'
            }
          },
          {
            label: 'Cantidad',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            yAxisID: 'y2',
            parsing: {
              xAxisKey: 'week',
              yAxisKey: 'quantity'
            },
            type: 'line',
            pointRadius: 0,
            fill: true,
            stepped: true
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: item => {
                if (item.dataset.label == 'Margen') {
                  return 'Margen: ' + formatter.currency(item.parsed.y)
                } else {
                  return 'Cantidad: ' + item.parsed.y
                }
              }
            }
          }
        },
        interaction: {
          intersect: false,
          axis: 'x',
          mode: 'index'
        },
        scales: {
          x: {
            stacked: true
          },
          y1: {
            position: 'right',
            grid: { display: false },
            ticks: {
              callback: (value, index, ticks) => {
                return formatter.currency(value)
              }
            }
          },
          y2: {
            position: 'left'
          }
        }
      }
    })
  }
})
</script>

<template>
  <div style="height: 40vh"><canvas ref="chart"></canvas></div>
</template>
