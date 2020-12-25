import { IKeymap } from "../../IUniversalKeymap";
import { Converter } from "../Converter";
import { StrShortcutConverter } from "../ShortcutConverter";

import * as chokidar from "chokidar";
import { fsUtils } from "../../Utils";
import {
  UserShortcuts,
  VisualStudioConfig,
  VisualStudioXmlConfig,
  VisualStudioXmlKeyboardShortcuts,
} from "./VisualStudio.models";
import { exportSettings, importSettings } from "./VsImportExport";

export class VisualStudioConverter extends Converter<string> {
  private devenPath: string;

  constructor(devenPath: string) {
    super("VisualStudio.json", new StrShortcutConverter("+", ", "));
    this.devenPath = devenPath;
  }

  protected async readIdeKeymap(): Promise<IKeymap<string>> {
    const xml = (await this.loadSettings(
      this.devenPath
    ));
    const config = this.xmlToConfig(xml);

    //TODO Load scheme
    const scheme = {};

    return config.userShortcuts.reduce<IKeymap<string>>((km, sc) => {
      km[sc.command] = sc.keybind;
      return km;
    }, scheme);
  }
  protected async writeIdeKeymap(ideKeymap: IKeymap<string>): Promise<void> {
    console.log("asd");
    const xml = (await this.loadSettings(
      this.devenPath
    ));

    if (this.addKmToXml(xml, ideKeymap)) {
      const fileName = `temp/imported${new Date().getTime()}`;
      await fsUtils.saveXml(fileName, xml);
      importSettings(this.devenPath, fileName);
    }
  }

  private xmlToConfig(xml: VisualStudioXmlConfig): VisualStudioConfig {
    const sc:
      | VisualStudioXmlKeyboardShortcuts
      | undefined = xml.UserSettings.Category.find(
      (element) => element.$.name === "Environment_Group"
    )?.Category?.find((element) => element.$.name === "Environment_KeyBindings")
      ?.KeyboardShortcuts[0];

    if (sc) {
      return {
        scheme: sc.ShortcutsScheme[0],
        userShortcuts:
          sc.UserShortcuts[0]?.Shortcut?.map((sc) => {
            return {
              keybind: sc._,
              command: sc.$.Command,
            };
          }) ?? [],
      };
    } else {
      return {
        scheme: "Visual Studio",
        userShortcuts: [],
      };
    }
  }

  private addKmToXml(
    xml: VisualStudioXmlConfig,
    ideKeymap: IKeymap<string>
  ): VisualStudioXmlConfig | undefined {
    const userShortcuts:
      | UserShortcuts[]
      | undefined = xml.UserSettings.Category.find(
      (element) => element.$.name === "Environment_Group"
    )?.Category?.find((element) => element.$.name === "Environment_KeyBindings")
      ?.KeyboardShortcuts[0]?.UserShortcuts;

    if (!userShortcuts) return undefined;
    userShortcuts[0] = userShortcuts[0] || {};
    const sc = userShortcuts[0];
    sc.Shortcut = sc.Shortcut || [];
    sc.RemoveShortcut = sc.RemoveShortcut || [];

    Object.keys(ideKeymap).forEach((key) => {
      sc.RemoveShortcut = sc.RemoveShortcut!.concat(
        sc.Shortcut!.filter((s) => s.$.Command === key)
      );
      sc.Shortcut = sc.Shortcut!.filter((s) => s.$.Command !== key);
      sc.Shortcut.push({
        $: {
          Command: key,
          Scope: "Global",
        },
        _: ideKeymap[key],
      });
    });
    return xml;
  }

  private loadSettings(
    devenPath: string,
    settingsPath: string = `temp/exported${new Date().getTime()}`
  ): Promise<VisualStudioXmlConfig> {
    return new Promise((resolve, error) => {
      const watcher = chokidar.watch(`${settingsPath}.*`, { interval: 0.5 });
      watcher.on("add", (path) => {
        resolve(fsUtils.readXml<VisualStudioXmlConfig>(path));
        watcher.close();
      });
      exportSettings(devenPath, settingsPath);
    });
  }
}
