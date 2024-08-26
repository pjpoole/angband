import { DungeonProfile } from './dungeonProfiles'

interface DungeonParams {
  profile: DungeonProfile
  persist: boolean
  quest: boolean
}

export class Dungeon {
  private readonly profile: DungeonProfile
  private readonly persist: boolean
  private readonly quest: boolean

  constructor(params: DungeonParams) {
    this.profile = params.profile
    this.persist = params.persist
    this.quest = params.quest
  }
}
