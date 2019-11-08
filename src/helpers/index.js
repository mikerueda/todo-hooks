const idGen = (prefix) => `${prefix}-${Math.random().toString().replace('.', '')}`
const findIndex = (list, id) => list.indexOf(list.find((e) => e.id === id))

export { idGen, findIndex }
