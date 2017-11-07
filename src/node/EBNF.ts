
export interface Query{

    Body: Body,
    Options: Options,
}

export interface Body{
    Where: Filter,

}
export interface Options{
    Columns : Columns,
    Order: string,

}
export interface Filter{
    LogicComparison: LogicComparison,
    mComparison: mComparison,
    sComparison: sComparison,
    Negation:Negation,

}export interface LogicComparison{
    Logic: Logic;


}export interface mComparison{

}export interface sComparison{

}

export interface Negation{

}
export interface Logic{
    and: string,
    or: string,

}export interface Columns{

    columns: Array<any>
}
export interface s_key{


}





