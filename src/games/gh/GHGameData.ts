import { BaseGameData } from '../GameData'
import { GloomhavenItem } from '../../State/Types';
import {SpoilerFilter} from '../../State/SpoilerFilter';
import { GameType } from '..';
import { FilterOptions } from '../../components/Providers/FilterOptions';

const oldFilterLocalStorageKey = 'ItemView:spoilerFilter';

class GHGameData extends BaseGameData  {
    constructor()
    {
        super("Gloomhaven", GameType.Gloomhaven);
    }
    isItemShown(item:GloomhavenItem, spoilerFilter: SpoilerFilter, {prosperity, soloClass}: FilterOptions) {
        if (item.id <= (prosperity+1)*7)
        {
            return true;
        }
        if (item.soloItem && soloClass.includes(item.soloItem)) {
            return true
        };
        return false;
    }

    convertSavedData(storageKey:string) {
        const loadedSpoilerFilterString = localStorage.getItem(oldFilterLocalStorageKey)

        // if it exists then it's a gloomhaven storage. Set it tot he new one
        if (loadedSpoilerFilterString) {
            localStorage.removeItem(oldFilterLocalStorageKey);
            localStorage.setItem(storageKey, loadedSpoilerFilterString);
        }
    }
    getItemSubfolder(item:GloomhavenItem) {
        if (item.id >= 152 && item.id <= 165) {
            return '152-165';
        } else if (item.id >= 64 && item.id <= 151) {
            return '64-151';
        } else if (item.id <= 14) {
            return '1-14';
        } else {
            let range_from = item.id % 7 === 0
                ? Math.floor((item.id - 1) / 7) * 7
                : Math.floor((item.id) / 7) * 7;
            return (range_from + 1) + '-' + (range_from + 7);
        }
    }
}

export default GHGameData;
