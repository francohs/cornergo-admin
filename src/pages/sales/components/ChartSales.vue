<script setup>
import Chart from 'chart.js/auto'
import formatter from 'tools/formatter'
import { onMounted, ref } from 'vue'

const canvas = ref(null)
let chart = null

onMounted(() => {
  chart = new Chart(canvas.value, {
    type: 'bar',
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: item => {
              if (item.dataset.label == 'Venta') {
                return 'Venta: ' + formatter.currency(item.parsed.y)
              } else {
                return 'Clientes: ' + item.parsed.y
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
          position: 'right'
        },
        y2: {
          position: 'left',
          grid: { display: false },
          ticks: {
            callback: (value, index, ticks) => {
              return formatter.currency(value)
            }
          }
        }
      }
    }
  })
})

defineExpose({
  update(data) {
    chart.data = {
      datasets: [
        {
          label: 'Clientes',
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          yAxisID: 'y1',
          parsing: {
            xAxisKey: 'hour',
            yAxisKey: 'count'
          }
        },
        {
          label: 'Venta',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          yAxisID: 'y2',
          parsing: {
            xAxisKey: 'hour',
            yAxisKey: 'total'
          },
          type: 'line',
          pointRadius: 0,
          fill: true,
          stepped: false,
          tension: 0.4
        }
      ]
    }

    chart.update()
  }
})
</script>

<template>
  <div style="height: 60vh"><canvas ref="canvas"></canvas></div>
</template>
