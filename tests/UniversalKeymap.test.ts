import { IShortcutConverter } from '../src/Connectors/Converters/ShortcutConverter';
import { VsCodeShortcut } from '../src/Connectors/Converters/VsCodeConverter/VsCodeConverter.models';
import { Keymap } from '../src/Connectors/Keymap';
import { Shortcut, SingleShortcut } from '../src/Connectors/Shortcut';
import { UniversalKeymap } from '../src/Connectors/Keymap';

describe('Universal keymap tests', function () {
  const converter: IShortcutConverter<string> = {
    toIde: (shortcut: Shortcut) => {
      if (shortcut.sc1.key === 'uniSc') return 'ideSc';
      return 'wrong';
    },
    toUni: (shortcut: string) => {
      if (shortcut == 'ideSc')
        return new Shortcut(new SingleShortcut(new Set(), 'uniSc'));
      return undefined;
    },
  };

  it('toUniKeymap should correctly map key and shortcut', async function () {
    const ideKeymap = new Keymap<VsCodeShortcut>({ ideKey: ['ideSc'] });

    const uni = ideKeymap.toUniKeymap({ uniKey: ['ideKey'] }, converter);

    expect(uni.get('uniKey')[0].sc1.key).toEqual('uniSc');
  });

  it('toUniKeymap should correctly map key and shortcut', async function () {
    const uniKm = new UniversalKeymap({
      uniKey: [new Shortcut(new SingleShortcut(new Set(), 'uniSc'))],
    });
    const ideKm = uniKm.toIdeKeymap({ uniKey: ['ideKey'] }, converter);

    expect(ideKm.get('ideKey')).toEqual(['ideSc']);
  });

  it('remove single shortcut', async function () {
    const expectedKm = new UniversalKeymap({
      uniKey: [
        new Shortcut(new SingleShortcut(new Set(['ctrl', 'alt']), 'uniSc')),
      ],
    });

    const uniKm = new UniversalKeymap({
      uniKey: [
        new Shortcut(new SingleShortcut(new Set(['ctrl', 'alt']), 'uniSc')),
        new Shortcut(new SingleShortcut(new Set(['ctrl', 'alt']), 'uniSc2')),
      ],
    });

    uniKm.remove(
      'uniKey',
      new Shortcut(new SingleShortcut(new Set(['ctrl', 'alt']), 'uniSc2'))
    );

    expect(uniKm).toEqual(expectedKm);
  });

  it('remove all shortcuts', async function () {
    const expectedKm = new UniversalKeymap({
      uniKey2: [
        new Shortcut(new SingleShortcut(new Set(['ctrl', 'alt']), 'uniSc')),
      ],
    });

    const uniKm = new UniversalKeymap({
      uniKey: [
        new Shortcut(new SingleShortcut(new Set(['ctrl', 'alt']), 'uniSc')),
        new Shortcut(new SingleShortcut(new Set(['ctrl', 'alt']), 'uniSc2')),
      ],
      uniKey2: [
        new Shortcut(new SingleShortcut(new Set(['ctrl', 'alt']), 'uniSc')),
      ],
    });

    uniKm.remove('uniKey');

    expect(uniKm).toEqual(expectedKm);
  });
});
