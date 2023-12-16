const colors = {
  green: {
    code: 1,
    value: '#66ee11'
  },
  purple: {
    code: 2,
    value: '#ad00fa'
  },
  blue: {
    code: 3,
    value: '#2d00fa'
  },
  red: {
    code: 4,
    value: '#fd1747'
  },
  yellow: {
    code: 5,
    value: '#fd1747'
  },
  orange: {
    code: 6,
    value: '#ff6c13'
  },
  cyan: {
    code: 8,
    value: '#00d6fb'
  }
}

const tetrominoes = [
  {
    name: 'I',
    shape: [
      [1],
      [1],
      [1],
      [1],
    ],
    color: colors.green,
  },
  {
    name: 'S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: colors.green,
  },
  {
    name: 'T',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: colors.purple,
  },
  {
    name: 'J',
    shape: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: colors.blue,
  },
  {
    name: 'Z',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: colors.red,
  },
  {
    name: 'O',
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: colors.yellow,
  },
  {
    name: 'L',
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: colors.orange,
  },
]

export {
  colors,
  tetrominoes,
}