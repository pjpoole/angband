import { Parser } from './Parser'
import {
  asInteger,
  ParserValues
} from '../../common/utilities/parsing/primitives'

import { Name, NameJSON, NamesRegistry } from '../../common/core/names'

type NameFields = 'section' | 'word'

export class NameParser extends Parser<NameFields, NameJSON> {
  static readonly fileName = 'names'
  static readonly registry = NamesRegistry

  constructor() {
    super()

    this.register('section', this.handleSection.bind(this))
    this.register('word', this.handleWord.bind(this))
  }

  _finalize(obj: NameJSON) {
    Name.fromJSON(obj).register()
  }

  handleSection(values: ParserValues) {
    const current = this.newCurrent()
    current.words = []
    current.section = asInteger(values)
  }

  handleWord(values: ParserValues) {
    const current = this.current
    current.words.push(values)
  }
}
