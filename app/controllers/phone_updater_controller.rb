class PhoneUpdaterController < ApplicationController

    def index
        @shelters = Shelter.all
    end

    def show
        @shelter = Shelter.find(params[:id])
        #stuff goes here about 
        @phones = PhoneUpdater.all
    end

    def create
    end

    def delete
    end

    private

    def phone_params
       params.require(:phone_updaters).permit(:shelter_id, :phone_number)
    end
end
