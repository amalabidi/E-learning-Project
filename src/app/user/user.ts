export class User{
    admin:boolean=false;
    name:string="";
    lastname:string="";
    password:string="";
    email:string="";
    mobile:number=null;
    provenances:string[]=[];
    company:string="";
    habilitation:string="";
    permissions:string[]=[];
    secondaryPermissions:string[]=[];
    users: string[]=[];
    authorisedConnection: boolean=true;
    groupedAction: string[]=[];
    tarif:number=null;
    typeTarif:string="";
}