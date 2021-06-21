export class Sort {

    private sortOrder = 1;
    private collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
    });


    constructor() {
    }

    public startSort(property, order, type = "",champs) {
        if (order === "desc") {
            this.sortOrder = -1;
        }

        return (a, b) => {
            if(champs=='client'){
                a=a.client[0]? a.client[0]:""
                b=b.client[0]? b.client[0]:""
            }
            if(champs=='vendeur'){
                a=a.vendeur[0]? a.vendeur[0]:""
                b=b.vendeur[0]? b.vendeur[0]:""
            }
            if(champs=='provenance'){
                a=a.provenance[0]? a.provenance[0]:""
                b=b.provenance[0]? b.provenance[0]:""
            }
            if(champs=='formation'){
                a=a.formation[0]? a.formation[0]:""
                b=b.formation[0]? b.formation[0]:""
            }
            if(champs=='dossier'){
                a=a.dossier
                b=b.dossier
            }
            if (type === "date") {
                
                return this.sortData(new Date(a[property]), new Date(b[property]));
            }
            else {
                return this.collator.compare(a[property], b[property]) * this.sortOrder;
            }
        }
    }

    private sortData(a, b) {
        if (a < b) {
            return -1 * this.sortOrder;
        } else if (a > b) {
            return 1 * this.sortOrder;
        } else {
            return 0 * this.sortOrder;
        }
    }
}