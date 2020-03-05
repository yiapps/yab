# frozen_string_literal: true

class EmailPermutationValidator < ActiveModel::Validator
  def validate(user)
    @email = user.email
    user.errors.add(:email, I18n.t('users.invalid_email')) if blocked_email?
  end

  private

  def blocked_email?
    # TODO
    # @email
  end
end
