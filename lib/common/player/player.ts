import { Quest } from '../game/quest'

interface PlayerParams {
  options: PlayerOptions
}

interface PlayerOptions {
  birth: BirthOptions
}

interface BirthParams {
  levelsPersist: boolean
}

export class Player {
  readonly options: PlayerOptions

  readonly depthMax: number = 0
  readonly depthRecall: number = 0
  depth: number = 0

  quests: Quest[] = []

  constructor(params: PlayerParams) {
    this.options = params.options
  }
}

class BirthOptions {
  readonly levelsPersist: boolean

  constructor(params: BirthParams) {
    this.levelsPersist = params.levelsPersist ?? false
  }
}
