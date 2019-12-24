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

export class Baker {
  waste: Map<string, number> = new Map()
  requirements: Map<string, Receipe> = new Map()
  flattenTree: Map<string, number> = new Map()

  constructor(requirements: Map<string, Receipe>) {
    this.requirements = requirements
  }

  getOreFor(item: string, quantity: number = 1): number {
    const entry = this.requirements.get(item)

    if (item === 'ORE') {
      return quantity
    }

    if (!entry) {
      throw new Error(`Invalid tree, missing ${item}`)
    }

    if (this.waste.has(item)) {
      return this.bakeFromWaste(item, quantity)
    }

    let result = 0

    const bakedAmount = this.getMinimumBaked(quantity, entry.amount)
    const times = Math.floor(bakedAmount / entry.amount)

    this.flattenTree.set(item, (this.flattenTree.get(item) || 0) + bakedAmount)

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
      return this.getOreFor(item, quantity - currentlyUnused)
    }

    return 0
  }

  getMinimumBaked(wanted: number, fromReceipe: number) {
    let result = fromReceipe

    while (result < wanted) {
      result += fromReceipe
    }

    return result
  }
}
