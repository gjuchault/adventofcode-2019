export type Receipe = {
  amount: number
  requirements: Map<string, number>
}

export const buildBaker = (list: string[]) => {
  let result = new Map<string, Receipe>()

  for (const line of list) {
    const [left, right] = line.split(' => ')

    const [amountProduced, itemProduced] = right.split(' ')

    const requirements = new Map<string, number>()

    for (const leftItem of left.split(', ')) {
      const [amountRequired, itemRequired] = leftItem.split(' ')

      requirements.set(itemRequired, Number(amountRequired))
    }

    result.set(itemProduced, {
      amount: Number(amountProduced),
      requirements
    })
  }

  return new Baker(result)
}

export const getMinimumBaked = (wanted: number, fromReceipe: number) => {
  let result = fromReceipe

  while (result < wanted) {
    result += fromReceipe
  }

  return result
}

export class Baker {
  waste: Map<string, number> = new Map()
  cache: Map<string, number> = new Map()
  requirements: Map<string, Receipe> = new Map()

  constructor(requirements: Map<string, Receipe>) {
    this.requirements = requirements
  }

  reset() {
    this.waste = new Map()
    return this
  }

  getOreFor(item: string, initialQuantity: number = 1): number {
    const entry = this.requirements.get(item)

    if (item === 'ORE') {
      return initialQuantity
    }

    if (!entry) {
      throw new Error(`Invalid tree, missing ${item}`)
    }

    let quantity = initialQuantity

    if (this.waste.has(item)) {
      quantity = this.bakeFromWaste(item, quantity)
    }

    if (quantity === 0) return 0

    let result = 0

    const bakedAmount = getMinimumBaked(quantity, entry.amount)
    const times = Math.floor(bakedAmount / entry.amount)

    for (const requirement of entry.requirements) {
      // We can't just do this.getOreFor * times or we wouldn't save enough in
      // the waste
      let i = 0
      do {
        result += this.getOreFor(requirement[0], requirement[1])
        i += 1
      } while (i < times)
    }

    if (bakedAmount > quantity) {
      this.waste.set(item, bakedAmount - quantity)
    }

    return result
  }

  bakeFromWaste(item: string, quantity: number) {
    const currentlyUnused = this.waste.get(item)

    if (!currentlyUnused) {
      throw new Error(`Can not bake ${item} from waste`)
    }

    if (currentlyUnused > quantity) {
      this.waste.set(item, currentlyUnused - quantity)

      return 0
    }

    // if less or equal, we won't have waste anymore
    this.waste.delete(item)

    // if less, we need to bake more
    if (currentlyUnused < quantity) {
      return quantity - currentlyUnused
    }

    return 0
  }
}
