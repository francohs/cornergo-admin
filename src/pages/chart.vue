<script setup>
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import formatter from 'tools/formatter'

const chart = ref(null)

onMounted(async () => {
  const myChart = new Chart(chart.value, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: 'Margen',
          data: [1500, 1300, 500, 1000, 600, 4000],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y1'
          // fill: true,
          // type: 'line'
        },
        {
          label: 'Cantidad',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          yAxisID: 'y2'
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
          stacked: false
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
})
</script>

<template>
  <q-card class="q-ma-lg"
    ><q-card-section style="height: 50vh"
      ><canvas ref="chart"
    /></q-card-section>
  </q-card>
</template>
