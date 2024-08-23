import { Parser } from './Parser'
import { ParserValues } from '../../common/utilities/parsing/primitives'

import { Pain, PainJSON, PainRegistry } from '../../common/monsters/pain'

type PainFields = 'type' | 'message'

export class PainParser extends Parser<PainFields, PainJSON> {
  static readonly fileName = 'pain'
  static readonly registry = PainRegistry

  constructor() {
    super()

    this.register('type', this.integerRecordHeader('type'))
    this.register('message', this.handleMessage.bind(this))
  }

  _finalizeItem(obj: PainJSON) {
    Pain.fromJSON(obj).register()
  }

  handleMessage(values: ParserValues) {
    const current = this.current
    current.messages ??= []
    current.messages.push(values)
  }
}
